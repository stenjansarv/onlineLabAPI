module.exports = ({ publisherId, publicationId }) => !publicationId ? ({ publisherId }) : ({ publisherId, publicationId })
