import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import prompts from "prompts";
import minimist from "minimist";
import { blue, cyan, reset, red } from "kolorist";

const defaultTargetDir = "custom-component";

const argv = minimist(process.argv.slice(2), { string: ["_"] });
const argTargetDir = formatTargetDir(argv._[0]);
const cwd = process.cwd();

let targetDir = argTargetDir || defaultTargetDir;
const getProjectName = () =>
  targetDir === "." ? path.basename(path.resolve()) : targetDir;

const FRAMEWORKS = [
  {
    name: "react",
    display: "React",
    color: blue,
  },
  {
    name: "html",
    display: "Html",
    color: cyan,
  },
];
async function init() {
  let result;
  try {
    result = await prompts(
      [
        {
          type: argTargetDir ? null : "text",
          name: "projectName",
          message: reset("Project name:"),
          initial: defaultTargetDir,
          onState: (state) => {
            targetDir = formatTargetDir(state.value) || defaultTargetDir;
          },
        },
        {
          type: () =>
            !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "select",
          name: "overwrite",
          message: () =>
            (targetDir === "."
              ? "Current directory"
              : `Target directory "${targetDir}"`) +
            ` is not empty. Please choose how to proceed:`,
          initial: 0,
          choices: [
            {
              title: "Remove existing files and continue",
              value: "yes",
            },
            {
              title: "Cancel operation",
              value: "no",
            },
            {
              title: "Ignore files and continue",
              value: "ignore",
            },
          ],
        },
        {
          type: (_, { overwrite }) => {
            if (overwrite === "no") {
              throw new Error(red("✖") + " Operation cancelled");
            }
            return null;
          },
          name: "overwriteChecker",
        },
        {
          type: () => (isValidPackageName(getProjectName()) ? null : "text"),
          name: "packageName",
          message: reset("Package name:"),
          initial: () => toValidPackageName(getProjectName()),
          validate: (dir) =>
            isValidPackageName(dir) || "Invalid package.json name",
        },
        {
          type: "select",
          name: "framework",
          message: reset("Select a framework:"),
          initial: 0,
          choices: FRAMEWORKS.map((framework) => {
            const frameworkColor = framework.color;
            return {
              title: frameworkColor(framework.display || framework.name),
              value: framework.name,
            };
          }),
        },
      ],
      {
        onCancel: () => {
          console.log("inside error ");
          throw new Error(red("✖") + " Operation cancelled");
        },
      }
    ).catch(err => {
      console.log(err, err);
    });
  
    const { framework, overwrite, packageName } = result;
    const root = path.join(cwd, targetDir);
  
    if (!fs.existsSync(root)) {
      fs.mkdirSync(root, { recursive: true });
    }
  
    const templateDir = path.resolve(
      fileURLToPath(import.meta.url),
      "../..",
      `template-${framework}`
    );
  
    const write = (file, content) => {
      const targetPath = path.join(root, file);
      if (content) {
        fs.writeFileSync(targetPath, content);
      } else {
        copy(path.join(templateDir, file), targetPath);
      }
    };
  
    const files = fs.readdirSync(templateDir);
    for (const file of files.filter((f) => f !== "package.json")) {
      write(file);
    }
  
    const pkg = JSON.parse(
      fs.readFileSync(path.join(templateDir, `package.json`), "utf-8")
    );
  
    pkg.name = packageName || getProjectName();
  
    write("package.json", JSON.stringify(pkg, null, 2) + "\n");
    
    const cdProjectName = path.relative(cwd, root);
    const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent)
    const pkgManager = pkgInfo ? pkgInfo.name : "npm";

    console.log(`\nDone. Now run:\n`);
    if (root !== cwd) {
      console.log(
        `  cd ${
          cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
        }`,
      )
    }
    switch (pkgManager) {
      case 'yarn':
        console.log('  yarn');
        console.log('  yarn dev');
        break;
      default:
        console.log(`  ${pkgManager} install`);
        console.log(`  ${pkgManager} run dev`);
        break;
    }
    console.log();

  } catch (cancelled) {
    console.log(cancelled.message);
  }
}

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  const pkgSpecArr = pkgSpec.split('/');
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1],
  };
}


function isEmpty(path) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

function isValidPackageName(projectName) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-");
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
}

function copy(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
}

function formatTargetDir(targetDir) {
  return targetDir?.trim().replace(/\/+$/g, "");
}


init().catch(err => {
  console.error(err);
})