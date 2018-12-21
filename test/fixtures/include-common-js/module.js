function lorem(dolor = "") {
    const ipsum = 'sit';
    return `${ipsum} ${dolor || ''} amet`;
}

module.exports = {
    lorem,
    dolor: 'sit',
    amet: "consectetur",
    adipisicing: `elit`
};