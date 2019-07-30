# DRY : Do not repeat yourself

This concept is advising us to divide code that does the same thing to small parts.
Sometimes we have multiple lines of code basically doing the same: like filter by array with specified criteria, adding some things to object etc.
Usually good practice is to get rid of it.

Example of **not good DRY code** is:

```ts
class Week {
  days: any;
  constructor() {
    this.days = [];
    this.days.push({
      name: 'Monday',
      order: 1
    });
    this.days.push({
      name: 'Tuesday',
      order: 2
    });
    this.days.push({
      name: 'Wednesday',
      order: 3
    });
    this.days.push({
      name: 'Thursdya',
      order: 4
    });
    this.days.push({
      name: 'Friday',
      order: 5
    });
    this.days.push({
      name: 'Saturday',
      order: 6
    });
    this.days.push({
      name: 'Sunday',
      order: 7
    });
  }

  list() {
    console.log(this.days);
  }
}

const w = new Week();
w.list();
```

In this example we have multiple added days with basically the same code to the class. We can avoid that by creating a method that is doing for that. Also with manually typing day name multiple times we are extending possibility of an error.

Example of proper class **with good DRY code**:

```ts
enum dayNames {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

class Day {
  name: string;
  order: number;

  constructor(name: string, order: number = 0) {
    this.name = name;
    this.order = order;
  }

  setOrder(order: number): Day {
    this.order = order;
    return this;
  }
}

class Week {
  days: Array<Day> = new Array();

  private addDay(name: string): Day {
    const day = new Day(name);
    const index = this.days.push(day);
    day.setOrder(index);
    return day;
  }

  constructor() {
    for (let dayName in dayNames) {
      this.addDay(dayName);
    }
  }

  listDays() {
    console.log(this.days);
  }
}

const firstWeek = new Week();
firstWeek.listDays();
```

In this example instead of typing manually each day we have implement `enum` with predefined day names and also introduced `Day` class. Thanks to that we can extend it to add more features to this class in the future, like `getDaylightTime`. Also we’ve implement `addDay` method to `Week` class which are doing pretty the same thing, but now if anything changes we have to update only one place in code instead of seven.

That is a **DRY** principle.
