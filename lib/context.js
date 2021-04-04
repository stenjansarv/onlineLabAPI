exports.contextualize = ({ publisherId, publicationId }) => !publicationId ? ({ publisherId }) : ({ publisherId, publicationId })
exports.employmentContext = ({ publisherId, employmentId }) => !employmentId ? ({ publisherId }) : ({ publisherId, employmentId })
exports.educationContext = ({ publisherId, educationId }) => !educationId ? ({ publisherId }) : ({ publisherId, educationId })