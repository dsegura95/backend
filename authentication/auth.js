const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class authControl{	

	async encryptPassword(password){

		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	async comparePassword(password1, password2){

		return bcrypt.compare(password1,password2);
	}

	async createToken(id){

		const token = jwt.sign({id:id}, 'mysecretkey',{

			expiresIn : 60 * 60
		})		
		return token;
	}

	async verifyToken(req,res,next){

		const token = req.headers['x-access-token'];
		if (!token){
			return res.status(404).send({auth: false, message: 'No token received'});
		}		
		try{

		const decoded = await jwt.verify(token,'mysecretkey');
		console.log(decoded);
		req.userId = decoded.id;
		next();
		}catch(err){next(err);}
	}
}

module.exports =authControl;