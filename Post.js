function Post(title, content) {

    var title = title;
    var content = content;

    this.getTitle = function () {

        return title;
    };

    this.getContent = function () {

        return content;
    };
}
