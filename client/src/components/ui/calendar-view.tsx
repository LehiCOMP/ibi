import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarEvent {
  date: Date;
  category: string;
}

interface CalendarViewProps {
  currentMonth: Date;
  events: CalendarEvent[];
}

const CalendarView = ({ currentMonth, events }: CalendarViewProps) => {
  // Calculate start day and week days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get starting day of the week (0-6, where 0 is Sunday)
  const startDay = getDay(monthStart);
  
  // Calculate days from previous month to show
  const prevMonthDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.unshift(addDays(monthStart, -i - 1));
    }
    return days;
  }, [monthStart, startDay]);
  
  // Calculate days for next month to fill grid
  const nextMonthDays = useMemo(() => {
    const totalCells = 42; // 6 rows * 7 days
    const filledCells = prevMonthDays.length + daysInMonth.length;
    const remainingCells = totalCells - filledCells;
    
    const days = [];
    for (let i = 1; i <= remainingCells; i++) {
      days.push(addDays(monthEnd, i));
    }
    return days;
  }, [monthEnd, prevMonthDays.length, daysInMonth.length]);
  
  // Find event by date
  const getEventForDay = (day: Date) => {
    return events.find(event => isSameDay(event.date, day));
  };
  
  // Get CSS class based on event category
  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'Culto':
        return 'bg-secondary';
      case 'Jovens':
        return 'bg-primary';
      case 'Comunhão':
        return 'bg-accent';
      default:
        return 'bg-primary-light';
    }
  };
  
  return (
    <div className="calendar">
      <div className="grid grid-cols-7 text-center text-sm">
        <div className="text-neutral-dark">D</div>
        <div className="text-neutral-dark">S</div>
        <div className="text-neutral-dark">T</div>
        <div className="text-neutral-dark">Q</div>
        <div className="text-neutral-dark">Q</div>
        <div className="text-neutral-dark">S</div>
        <div className="text-neutral-dark">S</div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mt-2 text-center">
        {/* Previous month days */}
        {prevMonthDays.map((day, index) => (
          <div key={`prev-${index}`} className="py-2 text-neutral-medium">
            {format(day, 'd')}
          </div>
        ))}
        
        {/* Current month days */}
        {daysInMonth.map((day, index) => {
          const event = getEventForDay(day);
          return (
            <div 
              key={`current-${index}`} 
              className={`py-2 ${event ? `${getCategoryClass(event.category)} text-white rounded-full font-bold` : 'font-bold'}`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
        
        {/* Next month days */}
        {nextMonthDays.map((day, index) => {
          const event = getEventForDay(day);
          return (
            <div 
              key={`next-${index}`} 
              className={`py-2 text-neutral-medium ${event ? `${getCategoryClass(event.category)} text-white rounded-full font-bold` : ''}`}
            >
              {format(day, 'd')}
            </div>
          );
        })}
      </div>
      
      <div className="mt-4">
        <div className="text-sm font-semibold mb-2">Legenda:</div>
        <div className="flex items-center text-xs mb-2">
          <div className="w-3 h-3 rounded-full bg-secondary mr-2"></div>
          <span>Culto Especial</span>
        </div>
        <div className="flex items-center text-xs mb-2">
          <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
          <span>Atividades Juvenis</span>
        </div>
        <div className="flex items-center text-xs">
          <div className="w-3 h-3 rounded-full bg-accent mr-2"></div>
          <span>Eventos Comunitários</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
