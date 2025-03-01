package utils

func Filter[T any](arr []T, predicate func(T) bool) []T {
	filtered := make([]T, 0, len(arr))
	for _, x := range arr {
		if predicate(x) {
			filtered = append(filtered, x)
		}
	}
	return filtered
}
