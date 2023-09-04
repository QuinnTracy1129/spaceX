import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import ListItem from "./ListItem";
import "./App.css";
import globalSearch from "./utilities/globalSearch";

export default function App() {
  const [launches, setLaunches] = useState([]),
    [isLoading, setIsLoading] = useState(true),
    [visibleLaunches, setVisibleLaunches] = useState([]),
    [searchKey, setSearchKey] = useState(""),
    [searchMatches, setSearchMatches] = useState([]),
    launchListRef = useRef(null);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(() => {
    setSearchMatches(globalSearch(launches, searchKey));
  }, 500);

  useEffect(() => {
    if (searchKey) {
      debouncedSearch();
    }
  }, [searchKey]);

  const handleIntersection = entries =>
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const dataIndex = entry.target.getAttribute("data-index");

        setVisibleLaunches(prev => {
          const hasLoaded = prev.find(i => i === dataIndex);

          if (!hasLoaded) return [...prev, dataIndex];

          return prev;
        });
      }
    });

  useEffect(() => {
    if (!isLoading && !searchKey) {
      const observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      });

      const items = launchListRef.current.querySelectorAll(".list-group-item");

      items.forEach(item => {
        observer.observe(item);
      });

      return () => {
        // Clean up the observer when the component unmounts
        observer.disconnect();
      };
    }
  }, [isLoading, searchKey]);

  useEffect(() => {
    axios
      .get("launches")
      .then(({ data }) => {
        //I cut it to 10 items because I fetched 205 items.
        if (data?.length > 0) setLaunches(data.slice(0, 10));

        setIsLoading(false);
      })
      .catch(console.log);
  }, []);

  return (
    <div className="container-fluid main-container d-flex align-items-center bg-secondary">
      <div className="card w-100">
        <div className="card-body">
          <input
            type="search"
            value={searchKey}
            onChange={({ target }) => {
              const { value } = target;

              setSearchKey(value.toUpperCase());

              if (!value && searchMatches.length > 0) setSearchMatches([]);
            }}
            placeholder="Enter keywords"
            className="form-control"
          />
          <ul ref={launchListRef} className="list-group mt-3">
            {isLoading ? (
              <ListItem hasLoaded={false} />
            ) : (
              (searchMatches.length > 0 ? searchMatches : launches)?.map(
                (launch, index) => (
                  <ListItem
                    key={`launch-${index}`}
                    index={index}
                    launch={launch}
                    hasLoaded={Boolean(
                      visibleLaunches.find(i => Number(i) === index)
                    )}
                  />
                )
              )
            )}
            {!searchKey && visibleLaunches.length === 10 && (
              <ListItem
                launch={{
                  name: "No more data has been detected:",
                  details: "We will provide update as soon as we fetch more.",
                }}
                hasLoaded={true}
              />
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
