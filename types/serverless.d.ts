/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Serverless as BaseServerless } from "serverless/aws";

interface Serverless extends BaseServerless {
   stepFunctions: StepFunctionsDef;
}

interface StepFunctionsDef {
   validate: boolean;
   stateMachines: StateMachines;
}

interface StateMachines {
   [name: string]: StateMachine;
}

interface StateMachine {
   events: StateMachineEvents;
   definition: StateMachineDefinition;
}

interface StateMachineEvents {
   schedule?: StateMachineSchedule;
}

interface StateMachineSchedule {
   rate: string;
   enabled: boolean;
}

interface StateMachineDefinition {
   Comment: string;
   StartAt: string;
   States: StateMachineStates;
}

interface StateMachineStates {
   InvokeFunction?: StateMachineFunctionInvocation;
}

interface StateMachineFunctionInvocation {
   Type: string;
   Resource: StateMachineResource,
   Parameters: any;
   End: boolean;
}

type StateMachineResource = string | { "Fn::GetAtt": [string, "Arn"] } | { "Fn::Join": [string, StateMachineResource[]] };