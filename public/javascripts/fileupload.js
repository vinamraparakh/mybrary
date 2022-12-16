console.log("fileupload.js loaded");

FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
// register filepond plugins to handle image previews and resizing of images before upload that was added in the book model

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 50,
    imageResizeTargetHeight: 75
})

FilePond.parse(document.body);
  // parsing file inputs into filepond object
  // Read file encode documentation for more info