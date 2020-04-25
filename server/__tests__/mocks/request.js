const mockRequest = (body, query, params) => ({
    body: {...body},
    query: {...query},
    params: {...params}
});

module.exports = mockRequest;
