import React, { useEffect, useRef, useState } from "react";
import { Redirect, useLocation, withRouter } from "react-router-dom";
import config from "../config";

function formatString(str, typed) {
  let regex = /(```([\s\S]*?)```|`([^`]+)`|([^`]+))/g;
  const result = [];
  let match;
  while ((match = regex.exec(str)) !== null) {
    if (match[2]) {
      const language = languages.find(v => match[2].startsWith(v))
      // code block
      result.push({ code: match[2], language });
    } else if (match[3]) {
      // bold text
      result.push({ bold: match[3] });
    } else {
      // normal text
      const codeRegex = /```([\s\S]*?)(```|$)/g;
      if (str?.match(codeRegex)) {
        if (str.match(codeRegex).find(v => v.includes(match[4]))) {
          const language = languages.find(v => match[4].startsWith(v))
          result.push({ code: match[4], language });
          return result
        }
      }
      result.push({ text: match[4] });
    }
  }
  return result;
}
const withTypist = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        text: '',
        index: 0,
        speed: 100,
      };
    }

    componentDidMount() {
      const { text, speed } = this.props;
      this.setState({ text, speed }, this.startTyping);
    }

    startTyping = () => {
      const { text, index } = this.state;

      if (index < text.length) {
        setTimeout(() => {
          this.setState({
            text: text.slice(0, index + 1),
            index: index + 1,
          }, this.startTyping);
        }, this.state.speed);
      }
    };

    render() {
      const { text } = this.state;
      return <WrappedComponent text={text} {...this.props} />;
    }
  };
};

const languages = ["javascript", "typescript", "jsx", "css", "scss", "sass", "less", "html", "xml", "markdown", "json", "yaml", "sql", "graphql", "c", "cpp", "java", "python", "ruby", "php", "go", "swift", "kotlin", "rust", "lua", "powershell", "shell", "batch", "makefile"]

const Loading = () => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const intval = setInterval(() => {
      setCount(o => o === 6 ? 0 : o + 1)
    }, 100)

    return () => {
      clearInterval(intval)
    }
  }, [])
  return (<>
    {count === 0 && <span>.</span>}
    {count === 1 && <span>...</span>}
    {count === 2 && <span>...</span>}
    {count === 3 && <span>....</span>}
    {count === 4 && <span>....</span>}
    {count === 5 && <span>....</span>}

  </>)

}

const SelfPlanClick = (props) => {
  const plans = ["free", "entry", "pro"]
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const plan = searchParams.get("plan")
  const ref = useRef()
  useEffect(() => {
    if (plans.includes(plan))
      ref.current?.click()
  }, [ref, plan])

  return <>
    {!window.store.isLoggedIn ? <Redirect to={"/login"} /> : <>
      Redirecting..
      <form action={window.store.baseURL + "user/stripe/subscribe"} method="POST" className="flex flex-1">
        <input type="hidden" name="token" value={window.store.api.defaults.headers.common['x-access-token']} />
        <input type="hidden" name="priceId" value={config.stripe[plan]} />
        {plan === "free" && <input type="hidden" name={plan} value="true" />}
        <button ref={ref} hidden type="submit">Try Out</button>
      </form>
    </>}

  </>
}

const AvailableHistoryInStore = withRouter((props) => {
  useEffect(() => {
    window.store.history = props.history
  }, [])
  return null
})



export { formatString, withTypist, languages, Loading, SelfPlanClick, AvailableHistoryInStore }