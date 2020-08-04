const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class authControl {

	async encryptPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	async comparePassword(password1, password2) {
		return bcrypt.compare(password1, password2);
	}

	async createToken(id, type) {
		const token = jwt.sign({ id: id, type: type }, 'mysecretkey', {
			expiresIn: 60 * 60
		})
		return token;
	}

	async verifyToken(req, res, next) {
		const token = req.headers['x-access-token'];
		if (!token) {
			return res.status(404).send({ auth: false, message: 'No token received' });
		}
		try {
			const decoded = await jwt.verify(token, 'mysecretkey');
			req.userId = decoded.id;
			req.userType = decoded.type;
			next();
		} catch (err) {
			return res.status(404).send({ auth: false, message: 'Token Invalido' });
		}
	}
}

module.exports = authControl;