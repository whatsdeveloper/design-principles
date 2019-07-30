# TDA: Tell don’t ask

This principle suggest that we should write code in a way that object behave rather then in what state they are in.
This can avoid unnecessary dependencies between classes and thanks to that have more maintainable code. It is strongly related to code encapsulation.

Example of code with **no TDA** principle:

```ts
class User {
  _id: string = '';
  firstName: string = '';
  lastName: string = '';
  tokens: number = 0;
}

class UserService {
  register(firstName: string, lastName: string): User {
    if (firstName.length < 3) {
      throw new Error('Name is not long enough.');
    }

    if (lastName.length < 3) {
      throw new Error('Name is not long enough');
    }

    const user = new User();
    user._id = Math.random()
      .toString(36)
      .substring(7);
    user.firstName = firstName.toLowerCase();
    user.lastName = lastName.toLowerCase();

    return user;
  }

  updateTokens(user: User, operation: string, amount: number): User {
    if (operation == 'add') {
      user.tokens += amount;
    }

    if (operation == 'sub') {
      if (user.tokens - amount >= 0) {
        user.tokens -= amount;
      } else {
        user.tokens = 0;
      }
    }

    return user;
  }
}

const uService = new UserService();
const u = uService.register('John', 'Smith');
uService.updateTokens(u, 'add', 1000);
console.log(u);
uService.updateTokens(u, 'sub', 1100);
console.log(u);
```

As we can see `UserService` access many times to `User` object properties, especially when updating `User.tokens` what if will we have that in many parts of our program and will want to change logic **how** it works?
Also take a look at validators: all logic how it should behave is inside a method, but we should make it more scalable and reusable.
Below is an example how to do it.

Example **with TDA**:

```ts
/**
 * VALIDATORS
 */
class StringLengthValidator {
  static greaterThan(value: string, length: number): boolean {
    if (value.length > length) {
      return true;
    } else {
      throw new Error('String is not long enough.');
    }
  }
}

class NaturalNumberValidator {
  static operation(from: number, amount: number) {
    if (from + amount <= 0) {
      return 0;
    }
    return from + amount;
  }
}

/**
 * INTERFACES
 */
interface IUserAccount {
  _id: string;
  firstName: string;
  lastName: string;
  tokens: number;
}

/**
 * ENUMS
 */
enum operations {
  add = 'add',
  sub = 'sub'
}

/**
 * CLASSES
 */
class User implements IUserAccount {
  _id: string = '';
  firstName: string = '';
  lastName: string = '';
  tokens: number = 0;

  constructor(firstName, lastName) {
    this._id = this._generateRandomID();
    this.setFirstName(firstName);
    this.setLastName(lastName);
  }

  setFirstName(newFirstName: string): User {
    StringLengthValidator.greaterThan(newFirstName, 3);
    this.firstName = newFirstName;
    return this;
  }

  setLastName(newLastName: string): User {
    StringLengthValidator.greaterThan(newLastName, 3);
    this.lastName = newLastName;
    return this;
  }

  updateTokens(amount: number): User {
    this.tokens = NaturalNumberValidator.operation(this.tokens, amount);
    return this;
  }

  private _generateRandomID() {
    return Math.random()
      .toString(36)
      .substring(7);
  }
}

class UserService {
  register(firstName: string, lastName: string): User {
    let user: User = null;

    try {
      user = new User(firstName, lastName);
    } catch (e) {
      console.log(e);
    }

    return user;
  }

  updateTokens(user: User, operation: operations, amount: number): User {
    if (operation === operations.sub) {
      amount *= -1;
    }

    return user.updateTokens(amount);
  }
}

/**
 * PROGRAM
 */
const uService = new UserService();
const u = uService.register('john', 'smith');
uService.updateTokens(u, operations.add, 1000);
console.log(u);
uService.updateTokens(u, operations.sub, 1100);
console.log(u);
```

At first sight it may seems like there is over-complexity and more code that is the need to be.
However, in a long shot thanks of a encapsulated and independent validator we can use it many times in many generic situations.
Properties of `User` class are only used inside of it, `UserService` is calling up level method to access it. Thanks to that we have all logic in one place, so when we will want to use `User` class somewhere else, program will behave as we expect it.
