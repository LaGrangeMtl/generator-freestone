export default function context(ctx:HTMLElement|Document = null):HTMLElement {
	return (ctx || document) as HTMLElement;
}
