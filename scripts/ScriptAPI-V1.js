/// api_version=2
var script = registerScript({
    name: "ScriptAPI-V1",
    version: "1.0",
    authors: ["Ajax"]
});

var File = Java.type("java.io.File");
var FileUtils = Java.type("org.apache.commons.io.FileUtils");
var StandardCharsets = Java.type("java.nio.charset.StandardCharsets");
var Paths = Java.type('java.nio.file.Paths');
var Files = Java.type('java.nio.file.Files');

var dir = new File(mc.mcDataDir, "LiquidBounce-1.8.9").getAbsolutePath();

var topDirectory = new File(dir, "scriptapi-v1");
var scriptsDirectory = new File(topDirectory, "scripts");
var compatibilityLayer = new File(topDirectory, "legacy.js");
var temporaryScripts = new File(topDirectory, "temp");

function readFile(file) {
    return FileUtils.readFileToString(file, StandardCharsets.UTF_8);
}

function writeStringToFile(file, content) {
    FileUtils.write(file, content, StandardCharsets.UTF_8);
}

var compatibilityLayerScript = readFile(compatibilityLayer);
var legacyScripts = scriptsDirectory.listFiles();

for (var i = 0; i < legacyScripts.length; i++) {
    var legacyScriptFile = legacyScripts[i];
    var legacyScriptContents = readFile(legacyScriptFile);

    legacyScriptContents = legacyScriptContents.replaceAll("moduleManager.registerModule", "moduleManagerV1API.registerModule");
    legacyScriptContents = legacyScriptContents.replaceAll("moduleManager.unregisterModule", "moduleManagerV1API.unregisterModule");
    legacyScriptContents = legacyScriptContents.replaceAll("moduleManager.getModule", "moduleManagerV1API.getModule");
    legacyScriptContents = legacyScriptContents.replaceAll("moduleManager.getModules", "moduleManagerV1API.getModules");

    legacyScriptContents = legacyScriptContents.replaceAll("commandManager.registerCommand", "commandManagerV1API.registerCommand");
    legacyScriptContents = legacyScriptContents.replaceAll("commandManager.unregisterCommand", "commandManagerV1API.unregisterCommand");
    legacyScriptContents = legacyScriptContents.replaceAll("commandManager.executeCommand", "commandManagerV1API.executeCommand");

    legacyScriptContents = legacyScriptContents.replaceAll("creativeTabs.registerTab", "creativeTabsV1API.registerTab");

    legacyScriptContents = legacyScriptContents.replaceAll("item.createItem", "itemV1API.createItem");

    legacyScriptContents = legacyScriptContents.replaceAll("value.createBlock", "valueV1API.createBlock");
    legacyScriptContents = legacyScriptContents.replaceAll("value.createBoolean", "valueV1API.createBoolean");
    legacyScriptContents = legacyScriptContents.replaceAll("value.createFloat", "valueV1API.createFloat");
    legacyScriptContents = legacyScriptContents.replaceAll("value.createInteger", "valueV1API.createInteger");
    legacyScriptContents = legacyScriptContents.replaceAll("value.createList", "valueV1API.createList");
    legacyScriptContents = legacyScriptContents.replaceAll("value.createText", "valueV1API.createText");
    legacyScriptContents = legacyScriptContents.replaceAll("value.createBlock", "valueV1API.createBlock");

    var finalScript = compatibilityLayerScript + "\n" + legacyScriptContents;

    var newFile = new File(temporaryScripts.getAbsolutePath(), legacyScriptFile.getName());
    writeStringToFile(newFile, finalScript);
    scriptManager.importScript(newFile);
    legacyScriptFile.delete();
    newFile.delete();
}
