FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)
// register filepond plugins to handle image previews and resizing of images before upload that was added in the book model

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

FilePond.parse(document.body);
  // parsing file inputs into filepond instances