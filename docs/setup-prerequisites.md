# Setup Prerequisites

## Required Runtime

This storefront is intended to start on Angular 21.

Current CLI requirement:

- Node `20.19.0+`
- or Node `22.12.0+`

Local note from initial setup:

- this machine is currently on Node `20.18.1`
- Angular CLI `21.2.5` refused to scaffold the app until Node is upgraded

## Recommended Local Versions

- Node `20.19.x` or `22.12.x+`
- npm `10+` or `11+`

## Recommended First Commands After Node Upgrade

```bash
npx @angular/cli@21.2.5 new clockwork-tyres-storefront --directory . --skip-git --routing --style=scss --strict --defaults
```

After scaffold:

```bash
npm run start
npm run test
npm run build
```

## Engineering Rules

- use standalone components by default
- use signals for feature state
- avoid jQuery and direct DOM manipulation
- keep supplier admin and CRM logic out of this repo
- integrate through typed repository/data-access layers
