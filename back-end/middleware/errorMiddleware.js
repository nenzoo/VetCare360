const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    // Gérer les erreurs de validation MongoDB
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(e => {
            return { param: e.path, msg: e.message };
        });
        return res.status(400).json({ errors });
    }

    // Gérer les erreurs de CastError (ID non valide)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            error: 'ID invalide',
            details: 'Le format de l\'identifiant fourni n\'est pas valide'
        });
    }

    res.status(statusCode).json({
        error: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };