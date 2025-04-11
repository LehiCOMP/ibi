import { useQuery } from '@tanstack/react-query';
import { format, parseISO, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Clock, MapPin, List, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import CalendarView from '../components/ui/calendar-view';

const Events = () => {
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
  });

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Calculate current month for calendar
  const currentMonth = new Date();

  // Format events for calendar
  const calendarEvents = events?.map(event => ({
    date: new Date(event.startTime),
    category: event.category || 'default'
  }));

  // Helper function to format date from ISO string
  const formatEventDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'dd', { locale: ptBR });
  };

  const formatEventMonth = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM', { locale: ptBR }).toUpperCase();
  };

  const formatEventTime = (startString: string, endString: string) => {
    const start = parseISO(startString);
    const end = parseISO(endString);
    return `${format(start, 'HH:mm', { locale: ptBR })} - ${format(end, 'HH:mm', { locale: ptBR })}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-6">Eventos</h1>

      <div className="mb-8">
        <p className="text-lg text-neutral-dark max-w-3xl">
          Confira nossos próximos eventos e participe das atividades da igreja.
          Encontros, cultos especiais, momentos de comunhão e muito mais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-secondary text-neutral-darkest flex justify-between items-center">
              <h3 className="font-semibold">Próximos Eventos</h3>
              <div className="flex space-x-2">
                <button 
                  className={`${viewMode === 'list' ? 'bg-white' : 'bg-transparent'} hover:bg-neutral-light p-2 rounded-md transition`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-5 w-5 text-primary" />
                </button>
                <button 
                  className={`${viewMode === 'grid' ? 'bg-white' : 'bg-transparent'} hover:bg-neutral-light p-2 rounded-md transition`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-5 w-5 text-primary" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-neutral-light">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <Card key={index} className="rounded-none shadow-none border-0">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-1/6 mb-4 sm:mb-0">
                          <Skeleton className="h-20 w-20 sm:w-full rounded-lg mx-auto" />
                        </div>
                        <div className="sm:w-5/6 sm:pl-4">
                          <Skeleton className="h-6 w-4/5 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : events?.map((event) => (
                <div key={event.id} className="p-4 flex flex-col sm:flex-row transition hover:bg-neutral-lightest">
                  <div className="sm:w-1/6 mb-4 sm:mb-0">
                    <div className="bg-primary text-white text-center rounded-lg overflow-hidden w-20 sm:w-full mx-auto">
                      <div className="bg-primary-dark py-1">
                        <span className="text-sm font-semibold">
                          {formatEventMonth(event.startTime)}
                        </span>
                      </div>
                      <div className="py-2">
                        <span className="text-2xl font-bold">
                          {formatEventDate(event.startTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="sm:w-5/6 sm:pl-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{event.title}</h4>
                        <p className="text-sm text-neutral-dark mb-2">{event.description}</p>
                        <div className="flex items-center text-xs text-neutral-dark space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-accent" />
                            {formatEventTime(event.startTime, event.endTime)}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-accent" />
                            {event.location}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition">
                          Lembrar
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="sm:w-1/6 mt-4 sm:mt-0 sm:ml-4"> {/* Added image container */}
                    <img src="https://via.placeholder.com/150" alt={`Image for ${event.title}`} className="w-full h-auto rounded-lg object-cover" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-primary text-white">
              <h3 className="font-semibold">
                Calendário de {format(currentMonth, 'MMMM', { locale: ptBR })}
              </h3>
            </div>

            <div className="p-4">
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <CalendarView 
                  currentMonth={currentMonth}
                  events={calendarEvents || []}
                />
              )}
            </div>

            <div className="p-4 bg-neutral-lightest">
              <button className="block w-full text-center bg-primary hover:bg-primary-dark text-white py-2 rounded-md font-medium transition">
                Ver Mês Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;