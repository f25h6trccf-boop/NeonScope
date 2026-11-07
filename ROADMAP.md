# NeonScope — Free Development Roadmap

NeonScope is a free, open browser-based audio/visual creation studio. No subscriptions, paid tiers, payment integration, or locked features.

## Phase 1 — Reliability and iPhone foundation
- Test Safari audio unlock, audio-file import, drawing, auto-draw, and video export
- Add installable web app manifest, icons, service worker, offline support
- Save projects locally, restore settings, undo/redo, responsive touch UI
- Improve error handling, accessibility, performance, and recording fallbacks

## Phase 2 — Real oscilloscope synthesis
- Generate stereo X/Y audio waveforms by tracing paths
- WAV export, sample-rate controls, gain limits and DC filtering
- SVG path import, vector simplification and scan ordering
- Oscilloscope calibration and synchronized preview

## Phase 3 — Advanced visuals
- WebGL rendering where supported, Canvas fallback
- 3D wireframes, fractals, particles, shaders, trails, morphing, kaleidoscope
- Multiple layers, color palettes, presets, camera movement

## Phase 4 — Music intelligence
- FFT spectrum, beat/onset detection, BPM estimation
- Frequency-based controls and automatic transitions
- Offline procedural prompt-to-preset creation
- Optional locally runnable AI features only where feasible without paid services

## Phase 5 — Creator studio and exports
- Timeline, keyframes, masks, Bézier editing, text, templates
- Reliable mobile video recording and format compatibility
- 9:16, 1:1, 16:9 layouts, PNG sequences, GIF, WAV, supported video formats
- Performance profiles for older phones and high-resolution desktop output

## Phase 6 — Sharing and community
- Export/import project files and shareable encoded preset links
- Community gallery only if free hosting, privacy and moderation are sustainable
- Collaboration as a later optional feature without paid infrastructure

## Constraints
- Keep all user-facing functionality free.
- Prefer local-first processing, no accounts and no server dependencies.
- Never add payment processing, paywalls, subscription billing or premium-only features.
- Respect device/browser limits; do not promise MP4, 4K or AI model inference on every iPhone.
- Verify each phase before declaring it finished.

## Implementation status — November 2026

### Implemented in code (not yet device-validated)
- Eight new procedural effects in studio.html, including 3D projected wireframe and particles
- Automatic evolving patterns, configurable speed, complexity, colors and trails
- XY stereo WAV export (PCM 16-bit, 44.1 kHz), with adjustable trace frequency
- Basic SVG single-path import and path sampling
- Local project save/load and JSON export/import
- Browser recording with format negotiation, PNG export, and music upload
- Phone orientation interaction where permission and browser allow
- PWA manifest, SVG icon, and basic offline service worker

### Not complete
- Hardware-validated XY signal fidelity and optimized trace ordering
- Full 3D scene editing, GPU shaders, advanced physics, AI generation
- Advanced multitrack editing, timeline, keyframes, robust cross-platform MP4 export
- Full accessibility and iPhone/iPad device test matrix
- Native iOS capabilities, collaboration, community hosting, complex MIDI workflows
- The remaining exploratory 100-feature wishlist

No paid tiers or payment processing are planned. New functionality should be validated on a physical iPhone before being considered production-ready.

## November 2026 unified workspace upgrade
Implemented in source (device/browser validation pending): mobile Visuals/Draw/Music/Library tabs, fullscreen canvas with fallback, local visual preset gallery, 16-step kick/snare/hi-hat/bass beat grid with JSON pattern import/export, finger drawing with brush width and redo, master transport stop for sequencer, error notices, refreshed offline service worker.

Still planned / not yet delivered: full multitrack song arrangement and instrument editor; beat export to WAV; persistent media library for audio/video; guaranteed video-with-audio export on Safari; advanced frequency-band-driven visual analysis and instrument separation; full drawing eraser/shape recognition/mirroring; accessibility and automated cross-browser regression suite; hardware/device validation; real streaming-service audio analysis (restricted by provider policies); production-grade diagnostics and performance benchmarks. These should not be represented as complete.
