import { render, renderToString, useState } from '@v8tenko/re-html';

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

const Fragment: ReHTML.Component = () => {
	return <>test</>;
};

// eslint-disable-next-line no-unused-vars
const ConditionalRender: ReHTML.Component = () => {
	const [value, setValue] = useState(1);

	return (
		<>
			{value % 2 === 0 && <p>help me start</p>}
			{value % 2 === 1 && <p>help me start 2</p>}
			<P value={value} />
			<button onClick={() => setValue((old) => old + 1)}>inc</button>
			{new Array(5).fill(0).map((_, i) => {
				return <p>{i}</p>;
			})}
			{value % 2 === 0 && <p>help me start middle</p>}
			{value % 2 === 1 && <p>help me start middle 2</p>}
			{new Array(6).fill(0).map((_, i) => {
				return <p>{i}</p>;
			})}
			{value % 2 === 0 && <p>help me 1</p>}
			{value % 2 === 1 && <p>help me 2</p>}
			{value % 2 === 0 && <p>help me 3</p>}
			{value % 2 === 1 && <p>help me 4</p>}
		</>
	);
};

const App: ReHTML.Component = () => {
	const [value, setValue] = useState(5);

	return (
		<>
			{new Array(value).fill(0).map((_, el) => {
				return el % 2 === value % 2 && <p>{el}</p>;
			})}
			<p>hello</p>
			<button onClick={() => setValue((old) => old + 1)}>inc</button>
			<>test</>
			<p>prikol</p>
			{new Array(value).fill(0).map((_, el) => {
				return el % 2 === value % 2 && <p>{el}</p>;
			})}
			<Fragment />
			<ConditionalRender />
		</>
	);
};

const root = document.getElementById('root');

render(App, root!);
