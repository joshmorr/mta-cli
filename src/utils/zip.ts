import AdmZip from "adm-zip";

export function unzip(buf: Buffer) {
  const zip = new AdmZip(buf);
  const unzipped: { name: string, data: string }[] = [];
  zip.forEach(file => {
    const data = file.getData();
    const text = new TextDecoder().decode(data);
    unzipped.push({
      name: file.name.replace(".txt", ""),
      data: text,
    });
  });
  return unzipped;
}
