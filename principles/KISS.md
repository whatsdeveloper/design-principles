# KISS : Keep it simple stupid

The main concept of this pattern is to keep as simple code as possible.
That means each method, class, interface should be names as clear as possible and also logic inside functions, method etc. should be clear and simple as it can be.

Example of how KISS **does NOT** look like:

```ts
class payup {
  howmuchtopay(
    region: string,
    amount: number,
    tax: number,
    country: string,
    price: number
  ) {
    if (country == 'pl_PL') {
      if (region == 'masovia' || region == 'Lubusz') {
        if (amount > 15) {
          price -= (15 / 100) * price;
          price += (tax / 100) * price;
          return price * amount;
        }
        return (price + (tax / 100) * price) * amount;
      } else {
        return (price + (tax / 100) * price) * amount;
      }
    } else {
      return price * amount;
    }
  }
}

const p = new payup();
console.log(p.howmuchtopay('masovia', 25, 23, 'pl_PL', 1000));
```

In this example we have code that is telling us nothing.
Class name, methods name are not written properly.
Body of a method is a mess with a lot of `if` and not maintainable.

After using **KISS** principle, it **does** look like this:

```ts
interface Country {
  code: string;
  discountAmountPercent: number;
  taxAmountPercent: number;
  discountRegions: Array<string>;
}

class Poland implements Country {
  code: string = 'pl_PL';
  discountAmountPercent: number = 15;
  taxAmountPercent: number = 23;
  discountRegions: Array<string> = ['masovia', 'lubusz'];
}

class Payment {
  setTax(price: any, tax: number) {
    return price + (tax / 100) * price;
  }

  setDiscount(price: any, discount: number) {
    return price - (discount / 100) * price;
  }

  pay(country: Country, region: string, amount: number, nettoPrice: number) {
    if (
      country.discountRegions.indexOf(region.toLowerCase()) != -1 &&
      amount > 15
    ) {
      nettoPrice = this.setDiscount(nettoPrice, country.discountAmountPercent);
    }

    const bruttoPrice = this.setTax(nettoPrice, country.taxAmountPercent);
    return bruttoPrice * amount;
  }
}

const payment = new Payment();
console.log(payment.pay(new Poland(), 'masovia', 25, 1000));
```

As you can in above code there is KISS principle.
This is scalable solution: we can have multiple countries and add new discount region with ease only modified a `discountRegions` property in a country class.
Thanks to the interface we can also make sure that each new country have the required properties.
Payment class has also methods that are named after what they do and thanks to that structure we optimised code to have only one if.

And that is kiss: clean, simple code.
