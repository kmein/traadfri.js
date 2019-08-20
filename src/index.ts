import Tradfri, { Credentials } from "ikea-tradfri";

import identity from './identity';

const identity: Credentials =
const tradfri: Tradfri = new Tradfri("192.168.178.28", identity);

tradfri
  .connect()
  .then(async credentials => {
    console.log(tradfri.devices);

    for (const device of tradfri.devices) {
      if (device.type === "Bulb") {
        await device.switch(!device.isOn);
      }
    }

    await tradfri.close();
  })
  .catch(console.error);
