import fs from "fs";
import path from "path";

export default ({ config }) => {
  const googleServicesPath = path.resolve(
    __dirname,
    "android/app/google-services.json",
  );

  if (process.env.GOOGLE_SERVICES_JSON) {
    fs.mkdirSync(path.dirname(googleServicesPath), { recursive: true });

    let jsonContent;

    try {
      jsonContent = Buffer.from(
        process.env.GOOGLE_SERVICES_JSON,
        "base64",
      ).toString("utf-8");
      JSON.parse(jsonContent);
    } catch {
      jsonContent = process.env.GOOGLE_SERVICES_JSON;
      JSON.parse(jsonContent);
    }

    fs.writeFileSync(googleServicesPath, jsonContent, "utf-8");
    console.log("✅ google-services.json written to", googleServicesPath);
  }

  return {
    ...config,
    android: {
      ...config.android,
      googleServicesFile: googleServicesPath,
    },
  };
};
