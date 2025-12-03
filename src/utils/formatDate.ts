import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Fonction formatage date
const formatDateDayMonthYear = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return format(new Date(dateStr), "d MMMM yyyy 'à' HH:mm", { locale: fr })
}

export { formatDateDayMonthYear }
