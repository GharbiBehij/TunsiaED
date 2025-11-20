"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
server.method(endpoint, function () { });
async function endpointname(req, res) {
    try {
        1;
        validate;
        input;
        2;
        perform;
        main;
        ActivityIcon(firebase, Database, etc);
        3;
        return response;
        to;
        front;
        end in a;
        json;
        way;
    }
    catch (error) {
        send;
        back;
        error(status, erros, codes);
    }
}
// this is basically the template for every api endpoint you want to do.
app.method('/api/example', async (req, res) => {
    try {
        const { field1, field2 } = req.body;
        // 1️⃣ Validate input
        if (!field1 || !field2) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // 2️⃣ Perform action
        const result = await doSomethingWith(field1, field2);
        // 3️⃣ Return success
        return res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        // 4️⃣ Handle error
        return res.status(500).json({ success: false, message: error.message });
    }
});
//# sourceMappingURL=api.js.map