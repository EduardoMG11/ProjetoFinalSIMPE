import fs from "fs";
import path from "path";

export default ({ config }) => {
  const googleServicesPath = path.resolve(
    __dirname,
    "android/app/google-services.json",
  );

  if (process.env.GOOGLE_SERVICES_JSON) {
    fs.mkdirSync(path.dirname(googleServicesPath), { recursive: true });
    fs.writeFileSync(
      googleServicesPath,
      Buffer.from(process.env.GOOGLE_SERVICES_JSON, "base64").toString("utf-8"),
    );
  }

  return {
    ...config,
    android: {
      ...config.android,
      googleServicesFile: googleServicesPath,
    },
  };
};
