export interface ComponentLifecycle {
	componentWillCreate(): void;
	componentDidCreate(): void;
	componentWillUnmount(): void;
}
