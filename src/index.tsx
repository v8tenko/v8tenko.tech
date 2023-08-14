import { render } from '@v8tenko/re-html';
import { useState } from '@v8tenko/re-html/state/hooks';

const P: ReHTML.Component<{ value: number }> = ({ value }) => {
	const [a, setA] = useState(10);

	return (
		<div>
			<p>hello</p>
			<b>{value + a}</b>
			<p>world</p>
			<button onClick={() => setA((old) => old + 1)}>click in P</button>
		</div>
	);
};

const App: ReHTML.Component = () => {
	const [value, setValue] = useState(1);

	return (
		<p>
			{value % 2 === 0 && <P value={value} />}
			<div>hello, world</div>
			<p>222</p>
			<ul>
				<li>1</li>
				<li>2</li>
				<li>3</li>
			</ul>
			<P value={value} />
			<P value={value} />
			<button onClick={() => setValue((old) => old + 1)}>click</button>
		</p>
	);
};

const root = document.getElementById('root');

render(App, root!);
