exports.getUser = function (req, res) {
    res.status(200).json({user: req.user});
}