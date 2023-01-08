package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	executions "cloud.google.com/go/workflows/executions/apiv1"
	"cloud.google.com/go/workflows/executions/apiv1/executionspb"
)

type Body struct {
	Num      int    `json:"num"`
	Workflow string `json:"workflow"`
}

func main() {
	ctx := context.Background()
	client, err := executions.NewClient(ctx)
	if err != nil {
		log.Fatal(err)
	}

	defer client.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var body Body
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			log.Fatal(fmt.Errorf("err on json decoding: %w", err))
		}

		res, err := client.CreateExecution(
			r.Context(),
			&executionspb.CreateExecutionRequest{
				Parent: "projects/graduation-project-2-365804/locations/asia-northeast1/workflows/" + body.Workflow,
				Execution: &executionspb.Execution{
					Argument:     fmt.Sprintf(`{"num":%d}`, body.Num),
					CallLogLevel: executionspb.Execution_LOG_ALL_CALLS,
				},
			},
		)
		if err != nil {
			log.Println(fmt.Errorf("err on execution creation: %w", err))
			w.WriteHeader(500)
			return
		}

		if res.Error != nil {
			log.Println(res.Error.String())
			log.Println(res.Error.StackTrace.String())
			w.WriteHeader(500)
			return
		}

		w.WriteHeader(200)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
