import { ApolloError, UserInputError } from 'apollo-server-express';
import { User } from '../../../db/models';
import { hashPassword, setTokens, tokenCookies, verifyPassword, checkUserRole } from '../../../helpers/util';

const userMutations = {
  signup: async (parent, { input }, { res }) => {
    try {
      const { name, email, password } = input;

      const hashedPassword = await hashPassword(password);

      if (hashedPassword instanceof Error) {
        throw new ApolloError('There was a problem creating your account, please try again')
      } else if (typeof hashedPassword === 'string') {

        const userData = {
          name,
          email,
          password: hashedPassword,
          role: 'USER'
        }

        const existingEmail = await User.findOne({ email: userData.email }).lean();

        if (existingEmail) {
          throw new ApolloError('Email already exists');
        }

        const newUser = new User(userData);
        const savedUser = await newUser.save();

        if (savedUser) {
          const tokens = setTokens(savedUser);
          const cookies = tokenCookies(tokens);

          res.cookie(...cookies.access);
          res.cookie(...cookies.refresh);

          return {
            message: 'User created!',
            user: savedUser
          };
        } else {
          throw new ApolloError('There was a problem creating your account')
        }
      }
    } catch (error) {
      return error
    }
  },
  login: async (parent, { input }, { res }) => {
    try {
      const { email, password } = input;

      const foundUser = await User.findOne({ email }).lean();

      if (!foundUser) {
        throw new UserInputError('Wrong email or password');
      }

      const passwordValid = await verifyPassword(password, foundUser.password);
      
      if (passwordValid) {
        const tokens = setTokens(foundUser);
        const cookies = tokenCookies(tokens);

        res.cookie(...cookies.access);
        res.cookie(...cookies.refresh);

        return {
          message: 'Authentication successful',
          user: foundUser
        }
      } else {
        throw new UserInputError('Wrong email or password');
      }
    } catch (error) {
      return error
    }
  },
  logout: async (parent, args, { res }) => {
    try {
      res.clearCookie('access');
      res.clearCookie('refresh');

      return true;
    } catch (error) {
      return error
    }
  },
  updateUserRole: async (parent, { id, role }, context) => {
    try {
      const allowedRoles = ['USER', 'ADMIN'];

      if (!allowedRoles.includes(role)) {
        throw new ApolloError('Invalid user role')
      }
      const updatedUser = await User.findOneAndUpdate(
        { _id: id }, { role }
      );
      return {
        message: 'User role updated. User must log in again for the changes to take effect.',
        user: updatedUser,
      }
    } catch (error) {
      return error;
    }
  },
  deleteUser: async (parent, { id }, context) => {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: id });

      return {
        message: 'User deleted!',
        user: deletedUser
      }
  
    } catch (error) {
      return error;
    }
  }
}

export default userMutations;