# OSIV Memlab Scenario

The scenario performs simple actions to identify memory leaks on the ONet [FRTEST Environment](https://osiv-frtest.ivnet.ch/).

## Installation and scenario execution

- Install [memlab](https://facebook.github.io/memlab/docs/installation)

- Defining amount of action rounds

    To get a telling picture of the memory consumption it's helpful to run the actions multiple  times in a row. Set the amount of rounds with the `repeat` option at the bottom of the `scenario.js` file.

        // 0 = 1 run, 1 = 2 runs, 2 = 3 runs, etc.
        repeat: () => 9,
- Run scenario

      memlab run --scenario path/to/scenario.js    
    
    To run headful

        memlab run --scenario path/to/scenario.js --headful

## Flow
The Flow is as follows:

### Setup

The setup action navigates to the starting point for measurements. A first snapshot is taken at the end of the setup for base measurement.

- Clear cookies
- Reload page
- Login
- Navigate to VP (insured person) Dektop
- Search for VP "Mühlebach Mario"
- Snapshot

### Action

The Action defines which actions are made on page to take the max memory usage snapshot. The action continues where setup ended.

- Open VP Details by clicking on desktop list record
- Navigate to VP Dossier tab
- Snapshot

### Revert

Revert ends the flow and takes a snapshot at the end which can be compared to the base snapshot.

- Close VP Detail
- Snapshot