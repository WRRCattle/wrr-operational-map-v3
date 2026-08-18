# WRR / ALR Operational Map — Standalone Safety Copy

**Prepared:** 18 August 2026 HST

**Status:** Version 3 prepared for publication and validation

**Source commit:** `62ccf97ab6ba4a2203eba65c85c6bb284b332a6b`

**Third map:** <https://WRRCattle.github.io/wrr-operational-map-v3/>

**Version 3 change:** The combined 10-acre channel network is split into separate default-off toggles for Gate Creek, Rock Creek, 3 Mile Creek, and Badger Creek.

## Purpose

Create a third public map containing the discussed updates to the original operational map while preserving the original repository and URL unchanged during this task.

## Scope

The standalone copy contains the current operational-map interface, embedded WRR/ALR reference layers, Rock Creek and Badger Creek watershed zones, full-watershed native-detail LiDAR terrain, the complete current Grasshopper Fire context, current burned-watershed terrain exposure, and watershed slope-class tiles. The lower-left “The property” summary card remains hidden.

The channel split uses the existing four component catchments. Each of the 1,617 D8-derived channel segments is assigned by its downstream endpoint to exactly one component: Gate Creek 200, Rock Creek 316, 3 Mile Creek 224, and Badger Creek 877. This is a planning classification of the derived network, not a surveyed stream-centerline determination.

## Source Limitations Preserved

- The 3-foot slope display is not uniformly native 3-foot data: approximately 61% is native 3-foot LiDAR and 39% is native 1-metre Badger Creek fallback resampled to the display grid.
- Terrain exposure is a terrain-consequence model, not observed BAER/BARC soil burn severity.
- Current fire statistics reflect the 17 August 2026 source snapshot embedded in the source map.
- Live weather, wildfire, hydrography, wetlands, utilities, and imagery layers require network access and remain subject to their source services.

## Safety Record

The original `WRRCattle/wrr-operational-map` repository was cloned read-only at commit `62ccf97ab6ba4a2203eba65c85c6bb284b332a6b`. The third map is packaged and published separately as `WRRCattle/wrr-operational-map-v3`; no push or edit to the original repository is part of this task.

## Validation

Publication and public browser validation are recorded after the Version 3 deployment.
