import { render } from '@v8tenko/re-html';
import { useState } from '@v8tenko/re-html/state/hooks';

const P: ReHTML.Component<{ value: number }> = ({ value }) => {
	const [a, setA] = useState(0);

	return (
		<div>
			<p>hello</p>
			<b>{value + a}</b>
			<p>world</p>
			<button onClick={() => setA((old) => old + 1)}>click in P</button>
		</div>
	);
};

const P2: ReHTML.Component<{ value: number }> = ({ value }) => {
	const [a, setA] = useState(100);

	return (
		<div>
			<b>{value + a}</b>
			<button onClick={() => setA((old) => old + 1)}>click in P2</button>
			<div>
				P section
				<P value={value} />
			</div>
		</div>
	);
};

const App: ReHTML.Component = () => {
	const [value, setValue] = useState(1);

	return (
		<div>
			{value % 2 === 0 && <P value={value} />}
			<P value={value} />
			<P value={value} />
			<button onClick={() => setValue((old) => old + 1)}>inc</button>
			<button onClick={() => setValue((old) => old - 1)}>dec</button>
			<P2 value={value} />
		</div>
	);
};

const root = document.getElementById('root');

render(App, root!);
