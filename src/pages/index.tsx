import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Card from "@/components/Card";
import Input from "@/components/Input";
import LogoSvg from "@/components/LogoSvg";
import Tab from "@/components/Tab";
import Head from "next/head";
import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import str_pad_left from "@/utils/strPadLeft";
import { LoremIpsum } from "lorem-ipsum";
import usePrevious from "@/utils/usePrevious";
import constants from "@/constants";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import Toggle from "@/components/Toggle";
import Cookies from "js-cookie";
import backend from "@/network/backend";
import CheckBox from "@/components/CheckBox";
import { useRouter } from "next/router";

export default function Home() {
  const notify = () => toast.success("Url Copied!");
  const parser = new XMLParser();

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 8,
      min: 4
    }
  });

  const [tab, setTab] = useState("manual");
  const [time, setTime] = useState("10");
  const [timerStatus, setTimerStatus] = useState("stop");
  const [timeLeft, setTimeLeft] = useState(10);
  const [feed, setFeed] = useState([]);
  const [image, setImage] = useState(0);
  const [xml, setXml] = useState("");
  const [xmlToggle, setXmlToggle] = useState(false);
  const [uuid, setUuid] = useState("");
  const router = useRouter();

  const copyUrl = `${constants.env.BASE_URL}/api/rss?user=${uuid}`;
  const prevFeed = usePrevious({ feed });

  const parseFeed = (feed: any) => {
    let jsonFeed = parser.parse(feed);
    if (jsonFeed.rss.channel?.item) {
      if (jsonFeed.rss.channel.item.length) {
        setFeed(jsonFeed.rss.channel?.item);
        setXml(feed);
      } else {
        setXml(feed);
        // @ts-ignore
        setFeed([jsonFeed.rss.channel?.item]);
      }
    } else {
      setXml("");
      setFeed([]);
    }
  };

  useEffect(() => {
    const fetchRSS = async () => {
      const { data } = await backend.getRss();
      parseFeed(data);
    };

    // @ts-ignore
    if (prevFeed?.feed !== feed) {
      fetchRSS();
    }
  }, []);

  useEffect(() => {
    const toggle = Cookies.get("toggle");
    const isTrue = toggle === "true";
    setXmlToggle(isTrue);
  }, []);

  const [input, setInput] = useState({
    title: "",
    subtitle: "",
    link: "",
    randomQuery: false
  });

  const timeButtons = [
    {
      title: "5s",
      id: "5"
    },
    {
      title: "10s",
      id: "10"
    },
    {
      title: "30s",
      id: "30"
    },
    {
      title: "1m",
      id: "60"
    }
  ];

  const startStopButtons = [
    {
      title: "Start",
      id: "start"
    },
    {
      title: "Stop",
      id: "stop"
    }
  ];

  const clearRSS = async () => {
    await backend.clearRss();
    const { data } = await backend.getRss();
    parseFeed(data);
  };

  const sendRSS = async () => {
    if (image === 0) {
      setImage(1);
    } else {
      setImage(0);
    }

    let title;
    let subtitle;
    let link;

    if (tab === "manual") {
      title = input.title ? input.title : lorem.generateWords();
      subtitle = input.subtitle ? input.subtitle : lorem.generateSentences();
      link = input.link ? input.link : "https://www.google.com/";
    } else {
      title = lorem.generateWords();
      subtitle = lorem.generateSentences();
      link = "https://www.google.com/";
    }
    const content = {
      title: title,
      subtitle: subtitle,
      link: input.randomQuery ? link : link + "?r=" + Math.random() * 1000,
      content: image === 0 ? "/rss/red.png" : "/rss/green.png"
    };
    const { data } = await backend.addRss(content);
    parseFeed(data);
  };

  useEffect(() => {
    const getUUID = async () => {
      const { data } = await backend.getUUID();
      Cookies.set("user", data);
      router.push(`/?user=${data}`, undefined, { shallow: true });
      setUuid(data);
    };

    const userCookie = Cookies.get("user");

    if (!userCookie) {
      getUUID();
    } else {
      setUuid(userCookie);
      router.push(`/?user=${userCookie}`, undefined, { shallow: true });
    }
  }, []);

  useEffect(() => {
    // exit early when we reach 0
    if (timeLeft < 0) {
      sendRSS();
      setTimeLeft(+time);
    }

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      if (timerStatus === "start") {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft, time, timerStatus]);

  const onTabClick = (event: any) => {
    event.preventDefault();
    setTab(event.target.id);
  };

  const onTimeButtonClick = (event: any) => {
    event.preventDefault();
    setTime(event.target.id);
    setTimeLeft(+event.target.id);
  };

  const onSelectStartStop = (event: any) => {
    event?.preventDefault();
    setTimerStatus(event.target.id);
  };

  const toggleXML = () => {
    const value = xmlToggle;
    setXmlToggle(!value);
    Cookies.set("toggle", (!value).toString());
  };

  const timeLeftMinutes = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;

    return str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
  };

  const onInputChange = (event: any) => {
    if (event?.target?.type === "checkbox") {
      setInput({ ...input, [event.target.id]: !event.target.checked });
    } else {
      setInput({ ...input, [event.target.id]: event.target.value });
    }
  };

  const manualAutomaticTable = () => {
    return tab === "manual" ? (
      <div className="min-w-max space-y-4">
        <Input
          className="min-w-full"
          id="title"
          value={input.title}
          name="Title"
          onChange={onInputChange}
        />
        <Input
          className="min-w-full"
          id="subtitle"
          value={input.subtitle}
          name="Subtitle"
          onChange={onInputChange}
        />
        <Input
          className="min-w-full"
          id="link"
          value={input.link}
          name="Link"
          onChange={onInputChange}
        />
        <CheckBox
          defaultChecked
          onChange={onInputChange}
          title="test"
          id="randomQuery"
        >
          append random query string
        </CheckBox>

        <div>
          <Button id="add" onClick={sendRSS}>
            Add
          </Button>
          <Button id="clear" onClick={clearRSS}>
            Clear
          </Button>
        </div>
      </div>
    ) : (
      <>
        <p>Time:</p>
        <ButtonGroup
          onClick={onTimeButtonClick}
          selected={time}
          buttons={timeButtons}
        />

        <div className="flex items-center justify-between">
          <ButtonGroup
            onClick={onSelectStartStop}
            selected={timerStatus}
            buttons={startStopButtons}
          />
          <p>{timeLeftMinutes()}</p>
        </div>
      </>
    );
  };

  return (
    <>
      <Head>
        <title>RSS-Generator</title>
        <meta name="description" content="RSS-Gen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 text-gray-900 flex-row">
        <nav className="flex items-center justify-between flex-wrap bg-blue-400 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <LogoSvg />
            <span className="font-semibold text-xl tracking-tight">
              RSS-Generator
            </span>
          </div>
          {/* header buttons */}
          <div className="justify-between flex items-center space-x-2 ">
            <p className="text-white font-bold">RSS endpoint:</p>
            <Input id="copy" className="w-72" value={copyUrl} readOnly />

            <CopyToClipboard text={copyUrl}>
              <Button id="copy" onClick={notify}>
                Copy
              </Button>
            </CopyToClipboard>
          </div>
        </nav>
        <div className="flex">
          <aside className="top-18 left-0 z-40 flex-wrap bg-blue-100 p-4 min-h-screen w-96">
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500">
              <Tab
                id={"manual"}
                onClick={onTabClick}
                title={"Manual"}
                active={tab === "manual"}
              />
              <Tab
                id={"automatic"}
                title={"Automatic"}
                onClick={onTabClick}
                active={tab === "automatic"}
              />
            </ul>
            <div className="p-6 bg-gray-50 space-y-4">
              {manualAutomaticTable()}
            </div>
          </aside>
          <div className="flex flex-grow">
            <div className="absolute right-0 flex-grow flex-end p-2 rounded m-2 bg-blue-400">
              <Toggle checked={xmlToggle} onClick={toggleXML}>
                Show XML
              </Toggle>
            </div>
            <div className="flex-grow space-y-4 p-4">
              {!xmlToggle ? (
                feed?.map((item) => (
                  // @ts-ignore
                  <Card key={item.id} item={item} />
                ))
              ) : (
                <p>{xml}</p>
              )}
            </div>
          </div>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            closeOnClick
            closeButton
            pauseOnHover={false}
            pauseOnFocusLoss={false}
            theme="light"
          />
        </div>
      </main>
    </>
  );
}
