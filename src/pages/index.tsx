import Button from "@/components/Button";
import ButtonGroup from "@/components/ButtonGroup";
import Card from "@/components/Card";
import Input from "@/components/Input";
import LogoSvg from "@/components/LogoSvg";
import Tab from "@/components/Tab";
import testdata from "@/utils/testdata";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import str_pad_left from "@/utils/strPadLeft";
import { LoremIpsum } from "lorem-ipsum";

export default function Home() {
  const parser = new XMLParser();

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });

  const [tab, setTab] = useState("manual");
  const [time, setTime] = useState("10");
  const [timerStatus, setTimerStatus] = useState("stop");
  const [timeLeft, setTimeLeft] = useState(10);
  const [feed, setFeed] = useState([]);
  const [image, setImage] = useState(0);

  useEffect(() => {
    const fetchRSS = async () => {
      const { data } = await axios.get("/api/rss");
      let jsonFeed = parser.parse(data);

      if (jsonFeed.channel?.item) {
        if (jsonFeed.channel.item.length) {
          setFeed(jsonFeed.channel?.item);
        } else {
          // @ts-ignore
          setFeed([jsonFeed.channel?.item]);
        }
      } else {
        setFeed([]);
      }
    };

    fetchRSS();
  }, [parser]);

  const [input, setInput] = useState({ title: "", subtitle: "" });

  const timeButtons = [
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
    },
    {
      title: "2m",
      id: "120"
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
    const { data } = await axios.delete("/api/rss");
  };

  const sendRSS = async () => {
    if (image === 0) {
      setImage(1);
    } else {
      setImage(0);
    }

    let title;
    let subtitle;

    if (tab === "manual") {
      title = input.title;
      subtitle = input.subtitle;
    } else {
      title = lorem.generateWords(1);
      subtitle = lorem.generateSentences(5);
    }
    const content = {
      title: title,
      subtitle: subtitle,
      link: "https://www.google.com/?" + Math.random() * 1000,
      content: image === 0 ? "/rss/red.png" : "/rss/green.png"
    };
    const { data } = await axios.post("/api/rss", content);
  };

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

  const timeLeftMinutes = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;

    return str_pad_left(minutes, "0", 2) + ":" + str_pad_left(seconds, "0", 2);
  };

  const onInputChange = (event: any) => {
    setInput({ ...input, [event.target.id]: event.target.value });
  };

  const manualAutomaticTable = () => {
    return tab === "manual" ? (
      <div className="min-w-max">
        <div>
          <Input
            id="title"
            value={input.title}
            name="Title"
            onChange={onInputChange}
          />
        </div>
        <div>
          <Input
            id="subtitle"
            value={input.subtitle}
            name="Subtitle"
            onChange={onInputChange}
          />
        </div>
        <Button id="add" onClick={sendRSS}>
          Add
        </Button>
        <Button id="clear" onClick={clearRSS}>
          Clear
        </Button>
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
        <title>RSS-Gen</title>
        <meta name="description" content="RSS-Gen" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 text-gray-900 flex-row">
        <nav className="flex items-center justify-between flex-wrap bg-blue-400 p-6">
          <div className="flex items-center flex-shrink-0 text-white mr-6">
            <LogoSvg />
            <span className="font-semibold text-xl tracking-tight">
              RSS-Gen
            </span>
          </div>
          {/* header buttons */}
          <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto"></div>
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
          <div className="p-6 space-y-4">
            {feed?.map((item) => (
              // @ts-ignore
              <Card key={item.id} item={item} />
            ))}
            <p>{JSON.stringify(feed)}</p>
          </div>
        </div>
      </main>
    </>
  );
}

/* export async function getServerSideProps() {
  console.log(redisString);

  //  const data = await redis.incr("counter");
  // return { props: { data } };
}
 */
