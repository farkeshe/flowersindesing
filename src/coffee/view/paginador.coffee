define [], () ->
	class Paginador
		# Inicializa el paginador
		init : (start, range, total) =>			
			@total = total
			@range = range
			@start = start

			if(total < range)
				@end = total
			else
				@end = range

		# Establece la cantidad total de elementos que existen
		setTotal : (total) =>
			@total = total

			if(total == 0)
				@start = 0
				@end = 0

			if(@range <= total && @end == 0)
				@end = @range
			else
				if(@end > total || @end == 0)
					@end = total
				if(@range >= total && (@end-@range) < @start)
					@end = total

		# Avanza el indice de inicio en la cantidad del rango del paginador
		next : () =>
			@start += @range
			@end += @range
		
			if(@start >= @total) 
				if(@total == 0)
					@start = 0
				else
					@start -= @range
		
			if(@end > @total)
				@end = @total

		#Retrocede el indice de inicio en la cantidad del rango del paginador
		previous : () =>
			@aux = @end - @start			
			@start -= @range

			if(@aux < @range)
				@end -= @aux
			else 
				@end -= @range
			
			if(@start < 0)
				@start = 0
			
			if(@end > 0)
				if(@end < @range) 
					if(@total == 0)
						@end = 0
					else
						@end = @range
			else
				if(@total < @range)
					@end += @total
				else
					@end += @range
		
		label : () =>			
			if((@start+1) > @total)
				aux = @total
			else
				aux = @start + 1
			
			if @total isnt null
				return "<b>"+aux+" - "+@end+"</b> de <b>"+@total+"</b>"
			else
				return "<b>0 - 0</b> de <b>0</b>"