function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
}
function load_file(file, callback) {
    const reader = new FileReader();
    reader.onload = function (evt) {
        if (evt.target && typeof (evt.target.result) == "string") {
            callback(evt.target.result, file);
        }
    };
    reader.readAsText(file);
}
export { shuffle, load_file };
