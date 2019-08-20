declare module "ikea-tradfri" {
  import { EventEmitter } from "events";

  export interface Credentials {
    psk: string;
    identity: string;
  }

  export type Spectrum = "white" | "rgb" | "none";

  export type Colour = "white" | "warm" | "glow" | number;

  export type HexColour = string;

  export interface IDevice extends EventEmitter {
    /** This is the internal ID used by the controller. It is not usually necessary to use this ID in this library. */
    readonly id: number;
    /** This is the name of the device and is the usual way to access it in this library. */
    readonly name: string;
    /** This indicates whether or not the Ikea controller believes this device to be powered on. */
    readonly alive: boolean;
  }

  export interface Bulb extends IDevice {
    readonly type: "Bulb";
    /** Whether this bulb is on or off */
    readonly isOn: boolean;
    /** Whether this bulb can be switched on and off */
    readonly switchable: boolean;
    /** Whether this bulb can be dimmed */
    readonly dimmable: boolean;
    /** This can be from 0 to 100. */
    readonly brightness: number;
    /** The light spectrum of the bulb: white, rgb or none */
    readonly spectrum: Spectrum;
    /** Reading the property will return "white", "warm" or "glow" if its value matches one of those settings (1, 62 or 97, respectively) or it will return the current numerical value. */
    readonly colour: Colour;
    /** An alternative spelling of colour, q.v.. */
    readonly color: Colour;
    /** The colour of the bulb expressed as RGB. */
    readonly hexcolour: HexColour;
    readonly hue: unknown;
    readonly saturation: unknown;
    /** This is the on-off switch. It should be sent true to turn the bulb on or false to turn it off. It will return a promise resolving to true if the setting was changed or false if it was not. */
    switch(isOn: boolean): Promise<boolean>;
    /** This can be set from 0 to 100. It will change the brightness of the Bulb: 100 is fully bright, 0 will turn the bulb off. This will return a promise resolving to true if the setting was changed or false if it was not. */
    setBrightness(brightness: number): Promise<boolean>;
    /**
     For white spectrum bulbs, this can be set to:

     - "white"
     - "warm" (or "warm white")
     - "glow" (or "warm glow")
      
     Alternatively it can be set to a number from 1 to 100 where 1 is the coolest colour temperature and 100 is the warmest. This will return a promise resolving to true if the setting was changed or false if it was not.

     The code is not yet written for RGB bulbs.
     */
    setColour(colour: Colour | HexColour): Promise<boolean>;
    /** An alternative spelling of setColour, q.v.. */
    setColor(colour: Colour | HexColour): Promise<boolean>;
  }

  export interface Plug extends IDevice {
    readonly type: "Plug";
    /** Whether this plug is on or off */
    readonly isOn: boolean;
    /** Whether this plug can be switched on and off */
    readonly switchable: boolean;
    /** This is the on-off switch. It should be sent true to turn the plug on or false to turn it off. It will return a promise resolving to true if the setting was changed or false if it was not. */
    switch(isOn: boolean): Promise<boolean>;
  }

  export interface Remote extends IDevice {
    readonly type: "Remote";
  }

  export interface Sensor extends IDevice {
    readonly type: "Sensor";
  }

  export type Device = Sensor | Remote | Plug | Bulb;

  export interface Group {
    /** This is the internal ID used by the controller. */
    readonly id: number;
    /** This is the name of the group and is the usual way to access it in this library. */
    readonly name: string;
    /** This returns whether the controller believes this group to be on or off. */
    readonly isOn: boolean;
    /** This is the name of the current scene, if any. */
    readonly scene: string;
    /** This will return an array of Scene class objects which are available to this group. */
    readonly scenes: Array<string>;
    /** Reading this will return the last group value applied. */
    readonly level: number;
    /** Setting this to on (true) will turn on all the bulbs in the group. Setting it to off (false) will turn them off. */
    switch(isOn: boolean): Promise<boolean>;
    /** Setting this will set all bulbs in the group to the required level. */
    setLevel(level: number): Promise<boolean>;
    /** This will set the scene for the group, so long as the name matches one of the scenes from the group. */
    setScene(scene: string): Promise<boolean>;
  }

  export default class Tradfri {
    /** This will return an array of all the devices that have been detected. */
    readonly devices: Array<Device>;

    /**
     * 
     * @param host The host can be a domain name such as device.example.com or a dotted IP address such as 192.168.1.20.
     * @param credentials 
     * @param debug There is a third parameter to new Tradfri. This is a boolean debug, defaultng to false. If set to true, there will be logging to stdout when devices etc. are updated.
     * 
     * It is safe to call tradfri.connect() multiple times or simultaneously on the same instance. The first call will perform the actual connect; subsequent calls will resolve when the connect is completed.
     */
    constructor(host: string, credentials: Credentials, debug?: boolean);

    connect(): Promise<Credentials>;
    /** Getting a group is similar to getting a device. Using the tradfri variable, you call tradfri.group(name) where name is the name of the group you are looking for. It will return undefined if not found. */
    group(name: string): Group | undefined;
    /**
     * Using the tradfri variable created above, you call tradfi.device(name) where name is the name of the device you are looking for. It will return the approriate class for name or undefined if it is not found.
     * @param name can also be an array of device names. In this case, trafri.device(array) will return an array of all the devices matched or an empty array if none are found. Currently there is no provision for wildcards.
     */
    device(name: string): Device | undefined;
    device(name: string[]): Device[];
    /** This can be used to reset the connection. */
    reset(): Promise<void>;
    /** This should be called before ending the program so that the gateway can clean up its resources and so that the program will close its connections. Note that it may nevertheless take a few seconds for the program to end as there may be timers still running. */
    close(): Promise<void>;
  }
}

