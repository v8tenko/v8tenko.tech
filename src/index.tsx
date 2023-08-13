import { render } from '@v8tenko/re-html';

const P: ReHTML.Component<{ value: number }> = ({ value }) => {
	return (
		<div>
			<p>hello</p>
			<b>{value}</b>
			<p>world</p>
		</div>
	);
};

const App: ReHTML.Component = () => {
	return (
		<p>
			<div>hello, world</div>
			<p>222</p>
			<ul>
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</ul>
			<P value={1} />
			<P value={2} />
			<button onClick={() => alert(1)}>click</button>
		</p>
	);
};

const root = document.getElementById('root');

render(App, root!);
