import fs from "fs";
import path from "path";

export default ({ config }) => {
  const googleServicesPath = path.resolve(
    __dirname,
    "android/app/google-services.json",
  );

  if (process.env.GOOGLE_SERVICES_JSON) {
    fs.mkdirSync(path.dirname(googleServicesPath), { recursive: true });
    const jsonContent = Buffer.from(
      process.env.GOOGLE_SERVICES_JSON,
      "base64",
    ).toString("utf-8");
    fs.writeFileSync(googleServicesPath, jsonContent, "utf-8");
    console.log("✅ google-services.json written to", googleServicesPath);
  }

  return config;
};
