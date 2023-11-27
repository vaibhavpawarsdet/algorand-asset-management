// type which graph or Rest page will work
export default type => {
    switch (type) {
        default:
            return import('./rest').then(provider => provider.default);
    }
};
