var ID;
(function (ID) {
    function* Generator() {
        let i = 0;
        while (true)
            yield i++;
    }
    ID.Generator = Generator;
    function get(generator) {
        return generator.next().value;
    }
    ID.get = get;
})(ID || (ID = {}));
export default ID;
