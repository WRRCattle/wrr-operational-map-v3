const fs = require('fs');
const path = require('path');
const vm = require('vm');

const packageRoot = path.resolve(__dirname, '..');
const channelSourcePath = path.join(packageRoot, 'assets', 'RCDIC_Current_Fire_Context_2026-08-17_v1.js');
const catchmentSourcePath = path.join(packageRoot, 'assets', 'RCDIC_Channel_Component_Catchments_Badger_Included_WGS84_2026-08-12.geojson');
const outputPath = path.join(packageRoot, 'assets', 'RCDIC_Channel_Network_By_Creek_2026-08-18_v1.js');

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(channelSourcePath, 'utf8'), sandbox);

const channels = sandbox.window.RCDIC_CURRENT_CHANNELS;
const catchments = JSON.parse(fs.readFileSync(catchmentSourcePath, 'utf8'));

const creekDefinitions = [
  { key: 'rock', sourceName: 'Rock Creek Reservoir outlet', label: 'Rock Creek', color: '#2378b7' },
  { key: 'threemile', sourceName: 'Threemile Creek diversion', label: '3 Mile Creek', color: '#20a6a4' },
  { key: 'gate', sourceName: 'Gate Creek diversion', label: 'Gate Creek', color: '#56b45d' },
  { key: 'badger', sourceName: 'Upper Badger Creek', label: 'Badger Creek', color: '#8066c2' },
];

function pointInRing(point, ring) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const [x1, y1] = ring[index];
    const [x2, y2] = ring[previous];
    const intersects = (y1 > point[1]) !== (y2 > point[1])
      && point[0] < ((x2 - x1) * (point[1] - y1)) / (y2 - y1) + x1;
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInGeometry(point, geometry) {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.some((polygon) => pointInRing(point, polygon[0])
    && !polygon.slice(1).some((hole) => pointInRing(point, hole)));
}

const catchmentBySourceName = new Map(catchments.features.map((feature) => [
  feature.properties.asset || feature.properties.name,
  feature.geometry,
]));

const groups = Object.fromEntries(creekDefinitions.map((definition) => [definition.key, {
  type: 'FeatureCollection',
  name: `${definition.label.replaceAll(' ', '_')}_10_Acre_Channel_Network`,
  properties: {
    creek_name: definition.label,
    color: definition.color,
    threshold_acres: 10,
  },
  features: [],
}]));

for (const feature of channels.features) {
  const downstreamPoint = feature.geometry.coordinates.at(-1);
  const matches = creekDefinitions.filter((definition) => pointInGeometry(
    downstreamPoint,
    catchmentBySourceName.get(definition.sourceName),
  ));

  if (matches.length !== 1) {
    throw new Error(`Channel segment ${feature.properties.idx} matched ${matches.length} component catchments`);
  }

  const definition = matches[0];
  groups[definition.key].features.push({
    ...feature,
    properties: {
      ...feature.properties,
      creek_group: definition.key,
      creek_name: definition.label,
      assignment_method: 'downstream endpoint within documented component catchment',
    },
  });
}

const assignedCount = Object.values(groups).reduce((total, group) => total + group.features.length, 0);
if (assignedCount !== channels.features.length) {
  throw new Error(`Assigned ${assignedCount} of ${channels.features.length} channel segments`);
}

const metadata = {
  prepared: '2026-08-18',
  source_channel_dataset: 'RCDIC_CURRENT_CHANNELS from RCDIC_Current_Fire_Context_2026-08-17_v1.js',
  source_component_catchments: 'Rock_Creek_Reservoir_Component_Catchments_Badger_Included_WGS84.geojson',
  classification_method: 'Each derived segment is assigned by its downstream endpoint to exactly one documented component catchment.',
  total_segments: assignedCount,
  segment_counts: Object.fromEntries(creekDefinitions.map((definition) => [
    definition.key,
    groups[definition.key].features.length,
  ])),
};

const output = `window.RCDIC_CHANNEL_GROUP_METADATA=${JSON.stringify(metadata)};\n`
  + `window.RCDIC_CHANNEL_GROUPS=${JSON.stringify(groups)};\n`;
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify(metadata, null, 2));
