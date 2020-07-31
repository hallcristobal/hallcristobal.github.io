import * as React from "react";
import { number } from "prop-types";

interface ICalculatorState {
    badNumber: boolean;
    baseDamage: number;
    maxHp: number;
    adjustedDamage: number;
    mitigationMathString: string;
    adjustedHp: number;
    activeJobs: string[];
    availableMitigations: { [key: number]: { active: boolean, def: IMitigation } };
};

interface IMitigation {
    ability: string;
    reduction: number | null;
    shields: { target: "self" | "ally", amount: number } | null;
}

interface IJobDescription {
    sort: number;
    mitigations: number[];
}

const RoleMitigations: { [key: number]: IMitigation } = {
    1:  { ability: "Reprisal",                           reduction: 0.1,  shields: null },
    2:  { ability: "Rampart",                            reduction: 0.2,  shields: null },
    3:  { ability: "Sentinel",                           reduction: 0.3,  shields: null },
    4:  { ability: "Intervention",                       reduction: 0.1,  shields: null },
    5:  { ability: "Intervention w/ Rampart",            reduction: 0.2,  shields: null },
    6:  { ability: "Intervention w/ Sentinel",           reduction: 0.25, shields: null },
    7:  { ability: "Intervention w/ Rampart & Sentinel", reduction: 0.35, shields: null },
    8:  { ability: "Divine Veil",                        reduction: null, shields: { target: "self", amount: 0.1 } },
    9:  { ability: "Passage of Arms",                    reduction: 0.15, shields: null },
    10: { ability: "Vengence",                           reduction: 0.3,  shields: null },
    11: { ability: "Nascent Flash",                      reduction: 0.1,  shields: null },
    12: { ability: "Shake It Off",                       reduction: null, shields: { target: "ally", amount: 0.12 } },
    13: { ability: "Shaddow Wall",                       reduction: 0.3,  shields: null },
    14: { ability: "The Blackest Night",                 reduction: null, shields: { target: "ally", amount: 0.25 } },
    15: { ability: "Dark Missionary",                    reduction: 0.1,  shields: null },
    16: { ability: "Nebula",                             reduction: 0.3,  shields: null },
    17: { ability: "Heart of Stone",                     reduction: 0.15, shields: null },
    18: { ability: "Heart of Light",                     reduction: 0.1,  shields: null },
    20: { ability: "Fey Illumination",                   reduction: 0.05, shields: null },
    21: { ability: "Sacred Soil",                        reduction: 0.1,  shields: null },
    19: { ability: "Collective Unconsious",              reduction: 0.1,  shields: null },
    22: { ability: "Feint",                              reduction: 0.1,  shields: null },
    23: { ability: "Troubadour",                         reduction: 0.1,  shields: null },
    25: { ability: "Tactician (Gun Samba)",              reduction: 0.1,  shields: null },
    24: { ability: "Shield Samba",                       reduction: 0.1,  shields: null },
    26: { ability: "Addle",                              reduction: 0.1,  shields: null },
    27: { ability: "Dark Mind",                          reduction: 0.2,  shields: null },
};

const Jobs: { [key: string]: IJobDescription } = {
    "PLD": { sort: 1, mitigations: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
    "WAR": { sort: 2, mitigations: [1, 2, 10, 11, 12] },
    "DRK": { sort: 3, mitigations: [1, 2, 13, 14, 15, 27] },
    "GNB": { sort: 4, mitigations: [1, 2, 16, 17, 18] },
    "WHM": { sort: 5, mitigations: [] },
    "SCH": { sort: 6, mitigations: [20, 21] },
    "AST": { sort: 7, mitigations: [19] },
    "MNK": { sort: 8, mitigations: [22] },
    "DRG": { sort: 9, mitigations: [22] },
    "NIN": { sort: 10, mitigations: [22] },
    "SAM": { sort: 11, mitigations: [22] },
    "BRD": { sort: 12, mitigations: [23] },
    "MCH": { sort: 13, mitigations: [25] },
    "DNC": { sort: 14, mitigations: [24] },
    "BLM": { sort: 15, mitigations: [26] },
    "SMN": { sort: 16, mitigations: [26] },
    "RDM": { sort: 17, mitigations: [26] },
};

const JobRoles = {
    Tank: [
        "PLD",
        "WAR",
        "DRK",
        "GNB",
    ],
    Healer: [
        "WHM",
        "SCH",
        "AST",
    ],
    Melee: [
        "MNK",
        "DRG",
        "NIN",
        "SAM",
    ],
    Ranged: [
        "BRD",
        "MCH",
        "DNC",
    ],
    Caster: [
        "BLM",
        "SMN",
        "RDM",
    ]
};

var invalidDamage = false;

export default class Calculator extends React.Component<{}, ICalculatorState> {
    constructor({ }) {
        super({});

        this.state = {
            badNumber: false,
            baseDamage: 0,
            maxHp: 0,
            adjustedDamage: 0,
            mitigationMathString: "",
            adjustedHp: 0,
            activeJobs: [],
            availableMitigations: {}
        }
    }

    updateMitigations = () => {
        let mitigations: number[] = [];

        this.state.activeJobs.forEach(job => {
            for (const id of Jobs[job].mitigations) {
                if (mitigations.indexOf(id) == -1) {
                    mitigations.push(id);
                }
            }
        });

        let actMitigations = this.state.availableMitigations;
        for (const _key of Object.keys(this.state.availableMitigations)) {
            const key = parseInt(_key);
            if (mitigations.indexOf(key) === -1) {
                delete actMitigations[key];
            }
        }

        for (const key of mitigations) {
            if (actMitigations[key] === undefined)
                actMitigations[key] =  { active: false, def: RoleMitigations[key] };
        }

        console.log("upmit", actMitigations);

        this.setState({
            availableMitigations: actMitigations
        }, this.applyMitigations);
    }

    applyMitigations = () => {
        var adjusted = this.state.baseDamage;
        var mathString = "" + this.state.baseDamage;

        Object.keys(this.state.availableMitigations).map(key => parseInt(key)).forEach(key => {
            console.log("apmit", key, this.state.availableMitigations[key]);
            const mit = this.state.availableMitigations[key];
            if (mit.active && mit.def.reduction !== null) {
                adjusted = adjusted * (1 - mit.def.reduction);
                mathString += " * " + mit.def.reduction;
            }
        });

        this.setState({
            adjustedDamage: adjusted,
            mitigationMathString: mathString
        });
    }

    onDamageUpdate = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!isNaN(Number(event.target.value))) {
            this.setState({
                badNumber: false,
                baseDamage: Number(event.target.value)
            }, this.applyMitigations);
            console.log("number", Number(event.target.value));
            invalidDamage = false;
        } else {
            console.log("bad number", event.target.value);
            invalidDamage = true;
        }
    }

    onHealthUpdate = (event: React.FocusEvent<HTMLInputElement>) => {
        if (!isNaN(Number(event.target.value))) {
            this.setState({
                maxHp: Number(event.target.value)
            });
            console.log("number", Number(event.target.value));
        } else {
            console.log("bad number", event.target.value);
        }
    }

    setActiveMitigation = (e: React.ChangeEvent<HTMLInputElement>, key: number) => {
        var adjusted = this.state.availableMitigations;
        adjusted[key].active = e.target.checked;
        this.setState({
            availableMitigations: adjusted
        }, this.applyMitigations)
    }

    setActiveJob = (event: React.ChangeEvent<HTMLInputElement>, job: string) => {
        console.log(event, job);

        const checked = event.target.checked;
        const jobs = this.state.activeJobs;
        const idx = this.state.activeJobs.indexOf(job);
        if (idx == -1 && checked) {
            jobs.push(job);
            this.setState({
                activeJobs: jobs
            }, this.updateMitigations);
        } else if (idx > -1 && !checked) {
            jobs.splice(idx, 1);
            this.setState({
                activeJobs: jobs
            }, this.updateMitigations);
        }
    };

    render() {
        const jobList = Object.keys(Jobs).map(job => {
            return (
                <div key={job}>
                    <span><input type="checkbox" onChange={(e) => this.setActiveJob(e, job)}></input></span>
                    <span> {job}</span>
                </div>
            );
        });

        const activeJobs = this.state.activeJobs.sort((a, b) => Jobs[a].sort - Jobs[b].sort).join(", ");
        const availableMitigations = Object.keys(this.state.availableMitigations).map(_key => {
            const key = parseInt(_key);
            return (
                <tr>
                    <td><input 
                        checked={this.state.availableMitigations[key].active} 
                        type="checkbox" 
                        onChange={(e) => this.setActiveMitigation(e, key)}></input>
                    </td>
                    <td><span> {this.state.availableMitigations[key].def.ability}</span></td>
                </tr>
            )
        });

        return (
            <div className="row">
                <div className="col-sm-3">
                    <h5>Party Makeup</h5>
                    {jobList}
                </div>
                <div className="col-md">
                    <div>
                        {invalidDamage ? (<div style={{ color: "red", fontSize: "0.9em" }}>Invalid Damage Number</div>) : (null)}
                        <label htmlFor="damageInput">Base Damage: </label>
                        <br />
                        <input
                            id="damageInput"
                            style={{ color: invalidDamage ? "red" : "black" }}
                            type="text"
                            onBlur={this.onDamageUpdate}></input>
                    </div>
                    <div>
                        {this.state.badNumber ? (<div style={{ color: "red", fontSize: "0.9em" }}>Invalid Damage Number</div>) : null}
                        <label htmlFor="damageInput">Starting Health: </label>
                        <br />
                        <input
                            id="health Input"
                            style={{ color: this.state.badNumber ? "red" : "black" }}
                            type="text"
                            onBlur={this.onHealthUpdate}></input>
                    </div>
                    <div>
                        <span>Active Jobs: {activeJobs}</span>
                        <div>
                            Available Mitigations:
                            <table>
                                <tbody>
                                    {availableMitigations}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <br />
                    <div>
                        <span>Math String: {this.state.mitigationMathString}</span>
                    </div>
                    <br />
                    <div>
                        <span>Adjusted Damage: {Math.ceil(this.state.adjustedDamage)}</span>
                    </div>
                </div>
            </div>
        )
    }
}