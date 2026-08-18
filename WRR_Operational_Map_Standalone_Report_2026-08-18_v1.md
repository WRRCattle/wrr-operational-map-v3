# WRR / ALR Operational Map — Standalone Safety Copy

**Prepared:** 18 August 2026 HST

**Status:** Published and validated

**Source commit:** `62ccf97ab6ba4a2203eba65c85c6bb284b332a6b`

**Third map:** <https://WRRCattle.github.io/wrr-operational-map-v3/>

**Version 2 change:** Every overlay toggle loads off by default; the satellite basemap remains visible.

## Purpose

Create a third public map containing the discussed updates to the original operational map while preserving the original repository and URL unchanged during this task.

## Scope

The standalone copy contains the current operational-map interface, embedded WRR/ALR reference layers, Rock Creek and Badger Creek watershed zones, full-watershed native-detail LiDAR terrain, the complete current Grasshopper Fire context, current burned-watershed terrain exposure, and watershed slope-class tiles. The lower-left “The property” summary card remains hidden.

## Source Limitations Preserved

- The 3-foot slope display is not uniformly native 3-foot data: approximately 61% is native 3-foot LiDAR and 39% is native 1-metre Badger Creek fallback resampled to the display grid.
- Terrain exposure is a terrain-consequence model, not observed BAER/BARC soil burn severity.
- Current fire statistics reflect the 17 August 2026 source snapshot embedded in the source map.
- Live weather, wildfire, hydrography, wetlands, utilities, and imagery layers require network access and remain subject to their source services.

## Safety Record

The original `WRRCattle/wrr-operational-map` repository was cloned read-only at commit `62ccf97ab6ba4a2203eba65c85c6bb284b332a6b`. The third map is packaged and published separately as `WRRCattle/wrr-operational-map-v3`; no push or edit to the original repository is part of this task.

## Validation

- GitHub Pages deployment completed successfully.
- The public page and representative current-fire, terrain-exposure, slope, and native-terrain assets returned HTTP 200.
- The public `index.html` SHA-256 exactly matched the vault copy: `e3c232c11c36c67696c7ed5f8dbafeb76ac8dffc1bfdf4eb3e02558bd5a8cd35`.
- A public headless-browser test confirmed all 41 overlay toggles load off, the satellite basemap remains active, and no page errors occur.
- The lower-left property summary computed to `display: none`.
