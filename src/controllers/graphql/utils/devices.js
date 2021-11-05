const { getDevicesCollection } = require("services/mongodb");

const mapDevices = (devices) => {
   return devices.map((device) => ({
      os: device.os
   }));
};

const getUserDevices = async (req) => {
   const devicesCollection = await getDevicesCollection(req);
   const devices = await devicesCollection.findMany({
      userId: req.user.id
   });
   return mapDevices(devices);
};

const addDevice = async (req, input) => {
   const devicesCollection = await getDevicesCollection(req);
   const devices = await getUserDevices(req);
   // TODO: update compare function
   if (devices.some((device) => device.os === input.os)) return devices;
   let device = {
      userId: req.user.id,
      os: input.os
   };
   device = await devicesCollection.create(device);
   devices.push({
      os: device.os
   });
   return devices;
};

const removeDevice = async (req, input) => {
   const devicesCollection = await getDevicesCollection(req);
   const devices = await devicesCollection.findMany({
      userId: req.user.id
   });
   // TODO: update compare function
   const deviceIndex = devices.findIndex((device) => device.os === input.os);
   if (deviceIndex === -1) return devices;
   await devicesCollection.delete(devices[deviceIndex].id);
   devices.splice(deviceIndex, 1);
   return mapDevices(devices);
};

module.exports = {
   getUserDevices,
   addDevice,
   removeDevice
};
