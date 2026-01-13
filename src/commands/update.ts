import parse from "csv-simple-parser";
import { importData } from "../db/import";
import { unzip } from "../utils/unzip";
import { getStaticData } from "../api/static";

export async function update() {
  const res = await getStaticData('lirr');
  const unzipped = unzip(Buffer.from(res));
  
  const parsed = unzipped.map(({ name, data }) => {
    return {
      name: name,
      data: parse(data, { header: true }) as Array<Record<string, string>>,
    };
  });

  importData(parsed, "data/lirr.db");
};
