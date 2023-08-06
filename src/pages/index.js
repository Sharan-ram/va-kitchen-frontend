import { startOfMonth, addMonths, eachDayOfInterval } from 'date-fns';

const Homepage = () => {
    function generateDaysOfMonth() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // Get the last day of the current month
      
        const days = [];
        for (let day = 1; day <= daysInMonth; day++) {
          days.push(new Date(currentYear, currentMonth, day));
        }
      
        return days;
      }

      const currentDate = new Date(); // Use the current date or any other date
      const daysOfMonth = generateDaysOfMonth(currentDate);

    //   const days = daysOfMonth.map((day) => {
    //     console.log({day})
    //     const dayOfMonth = day.getDate(); // Get the day of the month (1 to 31)
    //     // Render each day of the month in your tabular column
    //     return dayOfMonth
    //   });

    const meals = ['Breakfast', 'Lunch', 'Dinner'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
    // Function to check if a date is Sunday
    const isSunday = (date) => date.getDay() === 0;
  
    return (
      <table>
        <thead>
          <tr>
            <th>Day</th>
            {meals.map((meal) => <th key={meal}>{meal}</th>)}
          </tr>
        </thead>
        <tbody>
          {daysOfMonth.map((day, index) => (
            <tr key={day}>
              <td>{`${day.getDate()}, ${weekDays[day.getDay()]}`}</td>
              {meals.map((meal) => <td key={`${day}-${meal}`}>Content for {meal}</td>)}
            </tr>
          ))}
          {daysOfMonth.some(isSunday) && <tr style={{ height: '30px' }} />}
        </tbody>
      </table>
    );
}

export default Homepage