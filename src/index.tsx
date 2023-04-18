import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as esbuild from 'esbuild-wasm';
// import { start } from 'repl';

const App = () => {
    const ref = useRef<any>();
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const startService = async () => {
        ref.current = await esbuild.startService({
            worker: true,
            wasmURL: '/esbuild.wasm'
        });
    };

    useEffect(() => {
        startService();
    }, []);

    const onClick = async () => {
        if (!ref.current) {
            return;
        }
        // Handles transpiling. Is from edbuild-wasm.
        // Remember, 'transpiling' in JS is a process that takes 
        // any number of languages including JS ES6, TypeScript and pre
        // ES6 JSX and transforms it into Common JS which can be executed
        // by basically any environment e.g. an old or current browser.
        // Below we are selecting the language to be `jsx` and the 
        // 'target' property says the following.
        const result = await ref.current.transform(input, {
            loader: 'jsx',
            target: 'es2015'
        });

        setCode(result.code); 
    };

    return <div>
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <div>
            <button onClick={onClick}>Submit</button>
        </div>
        {/* pre elements have text that looks like code */}
        <pre>{code}</pre>
    </div>;
}

ReactDOM.render(
    <App/>,
    document.querySelector('#root')
)